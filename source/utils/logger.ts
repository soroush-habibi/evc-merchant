import fs from 'fs';
import path from "path";

export default function logger(data: object) {
    if (process.env.ROOT) {
        fs.appendFile(path.join(process.env.ROOT, "log.txt"), "\n" + new Date() + ": " + JSON.stringify(data), () => { });
    }
}