import fs from 'fs';
import path from "path";
export default function logger(data) {
    if (process.env.ROOT) {
        fs.appendFile(path.join(process.env.ROOT, "merchant.log"), "\n" + new Date() + ": " + JSON.stringify(data), () => { });
    }
}
