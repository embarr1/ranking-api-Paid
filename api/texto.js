
import { Jimp } from 'jimp';

export async function addText(text) {
  const image = new Jimp({ width: 600, height: 300, color: "#FFFFFF" });

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  image.print({ font, x: 10, y: 10, text });
  
  // Retorna o buffer diretamente ao invés de salvar no disco
  const buffer = await image.getBuffer("image/png");
  return buffer;
}
