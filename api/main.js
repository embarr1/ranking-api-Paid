
import { Jimp } from "jimp";

export async function generateImage() {
    const background = await Jimp.read('./assets/background.jpeg');
    
    // Retorna o buffer diretamente ao invés de salvar no disco
    const buffer = await background.getBuffer("image/png");
    return buffer;
}
