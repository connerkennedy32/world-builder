import Styles from './styles.module.css';
import { useSidebar } from '../ui/sidebar';

export default function LoadingSpinner() {
    const { state: sidebarState } = useSidebar();

    return (
        <div className={sidebarState === 'expanded' ? Styles.centerSidebarOpen : Styles.centerSidebarClosed}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-primary mx-auto mb-4"></div>
            </div>
        </div>
    );
}