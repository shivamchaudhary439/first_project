const sharp = require('sharp');
const fs = require('fs');
const resizeImage = async (req, res, next) => {
    try {
        if (!req.file) return next();
        await sharp(req.file.path)
            .resize(500, 500)
            .jpeg({ quality: 70 })
            .toFile(`uploads/resized-${req.file.filename}`);
        fs.unlinkSync(req.file.path);
        req.file.filename = `resized-${req.file.filename}`;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = resizeImage;