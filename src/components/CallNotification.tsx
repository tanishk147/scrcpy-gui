import { useEffect, useState } from 'react';
import { Phone, PhoneOff, PhoneIncoming } from 'lucide-react';
import { useI18n } from '../i18n';

interface CallNotificationProps {
    phoneNumber: string;
    device: string;
    onAnswer: () => void;
    onReject: () => void;
    onDismiss: () => void;
}

const COUNTDOWN = 30;

export default function CallNotification({ phoneNumber, onAnswer, onReject, onDismiss }: CallNotificationProps) {
    const { t } = useI18n();
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN);

    useEffect(() => {
        const id = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { onDismiss(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [onDismiss]);

    const displayName = phoneNumber || t('callNotification.unknown');
    const progress = (timeLeft / COUNTDOWN) * 100;

    return (
        <div
            className="fixed top-4 right-4 z-[400] w-72 rounded-2xl overflow-hidden"
            style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--border)',
                animation: 'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards'
            }}
        >
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(110%); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes ringPulse {
                    0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary) 40%, transparent); }
                    50%       { box-shadow: 0 0 0 10px transparent; }
                }
            `}</style>

            {/* Countdown progress bar */}
            <div className="h-0.5 w-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                    className="h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%`, backgroundColor: 'var(--primary)' }}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 flex items-center gap-3">
                <div
                    className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                        animation: 'ringPulse 1.2s ease-in-out infinite'
                    }}
                >
                    <PhoneIncoming size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {t('callNotification.incomingCall')}
                    </p>
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {displayName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                        {timeLeft}s
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={onReject}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-semibold transition-opacity hover:opacity-70 active:opacity-50"
                    style={{ color: '#ef4444' }}
                >
                    <PhoneOff size={15} />
                    {t('callNotification.decline')}
                </button>
                <div style={{ width: 1, backgroundColor: 'var(--border)' }} />
                <button
                    onClick={onAnswer}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-semibold transition-opacity hover:opacity-70 active:opacity-50"
                    style={{ color: '#22c55e' }}
                >
                    <Phone size={15} />
                    {t('callNotification.answer')}
                </button>
            </div>
        </div>
    );
}
