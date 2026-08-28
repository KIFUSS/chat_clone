export const checkIsPhone = (phone) => {
    if (phone.trim() === '') return false;
    const cleanedPhone = phone.replace("/\D/g", '');
    return cleanedPhone.length === 11 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8'));
} 