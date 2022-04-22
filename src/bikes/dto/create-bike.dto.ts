interface PhotoInterface {
  id: number;
  url: string;
}
export class CreateBikeDto {
  readonly model: string;
  readonly version: string;
  readonly frase: string;
  readonly price: number;
  readonly previousPrice: number;
  readonly photos: PhotoInterface[];
}
