/*
 * Based on https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
 * by Netanel Basal
 */

import { tap } from 'rxjs/operators';

export const logObservable = <T>(tag: string) => {
  const successColors = ['009688', '009400', '009425', '00944a', '00946f', '009494', '006f94', '004a94'];
  const errorColors = ['ff3333', 'ff6633', 'ff9933', 'ffcc33', 'ffff33', 'ccff33', '99ff33', '66ff33'];
  const completeColors = ['009999', '007399', '004d99', '002699', '000099', '260099', '4d0099', '730099'];

  const getRandomColor = (colorArray: string[]) => colorArray[Math.floor(Math.random() * colorArray.length)];

  const successColor = getRandomColor(successColors);
  const errorColor = getRandomColor(errorColors);
  const completeColor = getRandomColor(completeColors);

  const randomId = Math.floor(Math.random() * 200_000).toString(36);

  return tap<T>({
    next(value) {
      console.log(`%c[${randomId} ${tag}: Next]`, `background: #${successColor} ; color: #fff; padding: 3px; font-size: 9px;`, value);
    },
    error(error) {
      console.log(`%c[${randomId} ${tag}: Error]`, `background: #${errorColor}; color: #fff; padding: 3px; font-size: 9px;`, error);
    },
    complete() {
      console.log(`%c[${randomId} ${tag}]: Complete`, `background: #${completeColor}; color: #fff; padding: 3px; font-size: 9px;`);
    }
  });
};
