import React from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancelar', theme = 'primary' }) => {
    if (!isOpen) return null;

    const isDanger = theme === 'danger';

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`
                glass-panel w-full max-w-[450px] p-6 animate-fade-in
                ${isDanger ? 'border-danger/50 shadow-[0_0_40px_rgba(255,42,109,0.15)]' : 'border-primary/50 shadow-[0_0_40px_rgba(0,240,255,0.15)]'}
            `}>
                {title && (
                    <h2 className={`text-2xl mb-4 pb-3 border-b border-white/10 font-bold tracking-wide ${isDanger ? 'text-danger' : 'text-white'}`}>
                        {title}
                    </h2>
                )}

                <p className="mb-8 text-slate-300 text-lg leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-4 justify-end">
                    {onCancel && (
                        <button
                            className="btn btn-secondary flex-1 py-3 border-white/20 text-white hover:bg-white/10"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`btn flex-1 py-3 shadow-lg ${isDanger ? 'bg-danger text-white hover:bg-red-600 hover:shadow-red-600/30' : 'hover:shadow-primary/30'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
