import {
  Controller,
  Get,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, editFileName } from './utils/file-uploading';
import { diskStorage } from 'multer';
import { FileUpload } from './shared/interfaces/file.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 1 * 1000 * 1000,
      },
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async uploadPhoto(@UploadedFile() file: FileUpload, @Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({
      filepath: file.path.replace('\\', '/'),
    });
  }
}
