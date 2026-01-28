export function formatPaymentMethod(method: string): string {
    switch (method) {
        case 'CARD':
            return 'Credit/Debit Card';
        case 'FPX':
            return 'FPX Online Banking';
        default:
            return method;
    }
}

export function formatOrderOption(option: string): string {
    return option;
}

export function formatOrderStatus(status: string): string {
    switch (status) {
        case 'PREPARING':
            return 'Preparing';
        case 'READY':
            return 'Ready';
        case 'COMPLETED':
            return 'Completed';
        default:
            return status;
    }
}
