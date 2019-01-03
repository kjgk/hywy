package com.unicorn.hywy.utils;


import net.coobird.thumbnailator.Thumbnails;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

public class ThumbnailUtils {

    public static void process(File file, int width, int height, OutputStream outputStream) throws IOException {

        BufferedImage sourceImg = ImageIO.read(file);
        double ratio = height / Double.valueOf(width);
        int dx = 0, dy = 0, dw, dh, sw = sourceImg.getWidth(), sh = sourceImg.getHeight();
        if (ratio > sh / Double.valueOf(sw)) {
            dh = sh;
            dw = new Double(sh / ratio).intValue();
            dx = new Double((sw - dw) / 2).intValue();
        } else if (ratio < sh / Double.valueOf(sw)) {
            dw = sw;
            dh = new Double(sw * ratio).intValue();
            dy = new Double((sh - dh) / 2).intValue();
        } else {
            dw = sw;
            dh = sh;
        }
        Thumbnails.of(sourceImg)
                .sourceRegion(dx, dy, dw, dh)
                .size(width, height)
                .outputFormat("jpg")
                .toOutputStream(outputStream);
    }
}

