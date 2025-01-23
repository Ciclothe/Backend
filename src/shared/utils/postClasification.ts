import {
  CategoriesDto,
  ClasificationDto,
  PublicationsDto,
} from 'src/modules/feed/dto/feed.dto';
import { postOrganization } from './postOrganization';

export function postClasification(
  categories: CategoriesDto[],
  publications: PublicationsDto[],
) {
  const clasification: ClasificationDto[] = [];

  //Browse through categories that the user likes
  categories.forEach((category) => {
    //Checks if the array already has values
    if (clasification.length === 0) {
      //Enter the first value
      clasification.push({ id: category.id, note: 1 });
    } else {
      //Check if the category already exist in the array
      const existingCategory = clasification.findIndex(
        (item) => item.id === category.id,
      );

      if (existingCategory !== -1) {
        //If it exists, increments the value of this category for the user
        clasification[existingCategory].note++;
      } else {
        //If not exist, push the category in the array
        clasification.push({ id: category.id, note: 1 });
      }
    }
  });
  console.log(clasification);
  return postOrganization(clasification, publications);
}
