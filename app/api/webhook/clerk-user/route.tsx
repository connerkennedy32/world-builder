import { prisma } from '../../../../backend/db'
import { NextRequest } from 'next/server'
import { generateTutorialPageContent } from '@/utils/pagesHelper';

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
    // THERE IS NO SECURITY CHECKS HERE
    // TODO: Add security checks
    const payload: ClerkWebhookEvent = await req.json()
    const body = JSON.stringify(payload)

    const newUser = await prisma.user.create({
        data: {
            clerkId: payload.data.id,
            email: payload.data.email_addresses ? payload.data.email_addresses[0]?.email_address : null,
            username: payload.data.username || '',
            createdAt: new Date(payload.data.created_at),
            updatedAt: new Date(payload.data.updated_at),
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