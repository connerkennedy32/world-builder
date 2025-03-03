import { prisma } from '../../../../backend/db'
import { NextRequest } from 'next/server'
import { generateTutorialPageContent } from '@/utils/pagesHelper';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

interface ClerkWebhookEvent {
    data: {
        birthday: string;
        created_at: number;
        email_addresses?: Array<{
            email_address: string;
            id: string;
            linked_to: any[];
            object: string;
            reserved: boolean;
            verification: {
                attempts: number | null;
                expire_at: number | null;
                status: string;
                strategy: string;
            };
        }> | null;
        external_accounts: any[];
        external_id: string | null;
        first_name: string;
        gender: string;
        id: string;
        image_url: string;
        last_name: string | null;
        last_sign_in_at: number | null;
        object: string;
        password_enabled: boolean;
        phone_numbers: any[];
        primary_email_address_id: string;
        primary_phone_number_id: string | null;
        primary_web3_wallet_id: string | null;
        private_metadata: Record<string, any>;
        profile_image_url: string;
        public_metadata: Record<string, any>;
        two_factor_enabled: boolean;
        unsafe_metadata: Record<string, any>;
        updated_at: number;
        username: string | null;
        web3_wallets: any[];
    };
    object: string;
    type: string;
}


export async function POST(req: NextRequest) {
    const headerPayload = headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing svix headers', { status: 400 });
    }

    const payload = await req.text();
    const body = payload;

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return new Response('Webhook secret not configured', { status: 500 });
    }

    const wh = new Webhook(webhookSecret);

    let evt: ClerkWebhookEvent;

    try {
        // Verify the signature
        evt = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        }) as ClerkWebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Invalid signature', { status: 400 });
    }

    const newUser = await prisma.user.create({
        data: {
            clerkId: evt.data.id,
            email: evt.data.email_addresses ? evt.data.email_addresses[0]?.email_address : null,
            username: evt.data.username || '',
            createdAt: new Date(evt.data.created_at),
            updatedAt: new Date(evt.data.updated_at),
        },
    })

    if (newUser) {
        await prisma.item.create({
            data: {
                title: 'Tutorial',
                itemType: 'PAGE',
                userId: newUser.id,
                index: 0,
                content: generateTutorialPageContent(),
            }
        });
    }

    return Response.json({ newUser })
}