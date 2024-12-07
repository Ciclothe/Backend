import {
  ClasificationDto,
  ClasificationPostDto,
  PublicationsDto,
} from 'src/modules/feed/dto/feed.dto';

export function postOrganization(
  clasification: ClasificationDto[],
  publications: PublicationsDto[],
) {
  const clasificationPost: ClasificationPostDto[] = [];
  //map the publications array
  publications.forEach((publication) => {
    //map the category array inside each publication
    publication.categories.forEach((category) => {
      //Check if the category coincide with one of the user liked
      const existingCategory = clasification.findIndex(
        (item) => item.id === category.id,
      );

      if (existingCategory !== -1) {
        //If the category exist, check if it is already in the array
        const clasificatedPost = clasificationPost.findIndex(
          (clasificated) => clasificated.id === publication.id,
        );

        if (clasificatedPost !== -1) {
          //if is in the array, increases the score of the category
          const currentPercentage =
            clasification.find((item) => item.id === category.id)?.note ??
            0;
          clasificationPost[clasificatedPost].calification += currentPercentage;
        } else {
          //if is not in the array, push the new category
          clasificationPost.push({
            id: publication.id,
            calification:
              clasification.find((item) => item.id === category.id)
                ?.note ?? 0,
          });
        }
      }
    });
  });

  //organizes the array based on who has the best score
  clasificationPost.sort((a, b) => b.calification - a.calification);
  const sortedIds = clasificationPost.map((item) => item.id);

  return sortedIds;
}
