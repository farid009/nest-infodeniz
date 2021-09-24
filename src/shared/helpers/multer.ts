import { Request } from 'express';
import { extname } from 'path';

import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  req: Request,
  file: Record<string, any>,
  callback: any,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('only image files are allowed'),
      false,
    );
  }
  callback(null, true);
};

export const generateFileName =
  (prefix = 'file') =>
  (req: Request, file: Record<string, any>, callback: any) => {
    const fileExtension = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    callback(null, `${prefix}-${randomName}${fileExtension}`);
  };
