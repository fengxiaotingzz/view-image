import {extname} from 'path';
import { readdir } from 'node:fs/promises';
import {accessSync, constants, lstatSync, statfsSync} from 'node:fs';
import * as resemble from 'resemblejs';
import {Uri} from 'vscode'
import Jimp from "jimp/es";
import {isEmpty} from 'lodash-es'
import * as sharp from 'sharp';


// import * as classify from 'image-classify';npm install --save-dev @types/sharp

const imgNameList = ['.bmp', '.jpg', '.jpeg', '.gif', '.png', '.svg'];
let resultFiles: any[] = [];

const exitFile = (dir:  string):boolean => {
    try {
        accessSync(dir, constants.R_OK | constants.W_OK)

        return true;
    }catch(e) {console.error(e)}
    return false;
};

const mapFile = async (path: string) => {
   try {
    const files = await readdir(path);

    for(let val of files) {
        try {
            if (val !== 'node_modules' && val !== '.git' && val !== '.vscode') {
                const pathName = `${path}/${val}`;
                const stats = lstatSync(pathName);
                if (stats.isDirectory()) {
                    await mapFile(pathName);
                } else {
                    const flag = imgNameList.includes(extname(val));
                    if (flag) {
                        resultFiles.push(`${path}/${val}`);
                    }
                }
            }
        }catch(e) {
            console.log(e);
        }
    }

   }catch(e) {
    console.error(e);
   }
};

export const searchFile = async (dir: string | undefined):Promise<string[]> => {
    if (dir) {
        if (exitFile(dir)) {
            await mapFile(dir);

            return resultFiles;
        }
    }

    return [];
};

interface Result {
    [key: string]: {
        width: number;
        height: number;
        same: {
            [key: string]: {
                width: number;
                height: number;
            };
        };
    };
}

export const diffImage = async (imgList: any[]) => {
    const imageDiff = require('lcs-image-diff');

    // 使用jimp和imageDiff查找出相似度在0.9以上的图片。并放在一起
 const result: Result = {};
    const len = imgList?.length;
    let temp = [...imgList]

    for(let i = 0; i < len; i++) {
        let img1; 
        temp.splice(i, 1);
        try{
            console.log(111, await sharp(imgList[i]))
            img1 = (await Jimp.read(imgList[i])).bitmap;
        }catch(e){}
        if (img1) {
            for(let j = i + 1; j < temp?.length; j++) {
                let img2;
                try{
                    img2 = (await Jimp.read(imgList[j])).bitmap;
                }catch(e){}

                if (img2) {
                    const diff = imageDiff(img1, img2);
                    const key = imgList[i];

                    if(diff > 0.9) {
                        if (!result[key]) {
                            result[key] = {
                                width: img1.width,
                                height: img1.height,
                                same: {}
                            };
                        }
                        result[key].same[imgList[j]] = {width: img2.width, height: img2.height};
                    } else {
                        result[key] = {
                            width: img1.width,
                            height: img1.height,
                            same: {}
                        };

                        console.log(222, imgList[j], img2)
                        result[imgList[j]] = {
                            width: img2.width,
                            height: img2.height,
                            same: {}
                        };
                    }

                    temp.splice(j, 1);
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    console.log(111, result)

    if (!isEmpty(result)) {
        return result;
    }
};

    // jimp.read(img1, (err: any, lenna: any) => {
    //     console.log(err)
    // })
    
    // console.log(imageDiff(image1, image2));