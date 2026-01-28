// Password strength calculator utility
export const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '', color: '', width: '0%' };
  
  let strength = 0;
  if (password.length >= 1) strength++; // Weak for any input
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const levels = [
    { strength: 0, label: '', color: '', width: '0%' },
    { strength: 1, label: 'Weak', color: 'bg-red-500', width: '20%' },
    { strength: 2, label: 'Fair', color: 'bg-orange-500', width: '40%' },
    { strength: 3, label: 'Good', color: 'bg-yellow-500', width: '60%' },
    { strength: 4, label: 'Strong', color: 'bg-emerald-500', width: '80%' },
    { strength: 5, label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
    { strength: 6, label: 'Excellent', color: 'bg-emerald-700', width: '100%' },
  ];
  
  return levels[Math.min(strength, 6)];
};
