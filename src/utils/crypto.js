// Simple hash function for demo purposes
// In production, use a proper backend with bcrypt or similar
export const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
};

export const verifyPassword = (password, hashedPassword) => {
    return hashPassword(password) === hashedPassword;
};
