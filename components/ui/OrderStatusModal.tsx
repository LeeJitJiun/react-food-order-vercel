'use client';

import { CheckCircle2 } from 'lucide-react';

interface OrderStatusModalProps {
    status: 'idle' | 'ordering' | 'complete';
    onClose: () => void;
}

export function OrderStatusModal({ status, onClose }: OrderStatusModalProps) {
    if (status === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#1a1816] flex items-center justify-center p-10 transition-colors">
            <div className="text-center max-w-sm">
                {status === 'ordering' ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-gray-100 dark:border-white/5 border-t-[#c8a47e] rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-bold italic mb-2 dark:text-white">
                            Planting your order...
                        </h2>
                        <p className="text-gray-400">Our kitchen is preparing the soil.</p>
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#e8f3ee] dark:bg-emerald-900/30 text-[#2d5a27] dark:text-emerald-400 rounded-full flex items-center justify-center mb-8">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-4xl font-black italic mb-4 dark:text-white">
                            Cultivated.
                        </h2>
                        <p className="text-gray-400 mb-10 leading-relaxed">
                            Your selection has been harvested and is on its way to your sanctuary.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            Return to Oasis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
