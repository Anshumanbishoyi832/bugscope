import crypto from "crypto";

const generateApiKey = () => {
    const random = crypto.randomBytes(24).toString("hex");
    return `bgs_${random}`;
};

export default generateApiKey;