const generateUsername = (name: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${name.replace(/\s+/g, "").toLowerCase()}${randomNum}`;
};

export default generateUsername;
