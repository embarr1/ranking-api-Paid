import Jimp from 'jimp';

export async function addText(text) {
  const image = new Jimp(600, 300, "#FFFFFF");
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  image.print(font, 10, 10, text);
  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  return buffer;
}
