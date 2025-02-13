import { CategoriesDto } from 'src/modules/feed/dto/feed.dto';

export function swipeReco(
  likedCategories: CategoriesDto[],
  likedTags: CategoriesDto[],
  swipedCategories: CategoriesDto[],
  swipedTags: CategoriesDto[],
  allPosts: any[],
) {
  return allPosts
    .map((post) => {
      let score = 0;

      // Assign points based on category matches
      if (
        post.categories.some((category) => likedCategories.includes(category))
      ) {
        score += 5;
      }

      // Assign points based on swiped category matches
      if (
        post.categories.forEach((category) =>
          swipedCategories.includes(category),
        )
      ) {
        score += 7;
      }

      // Assign points based on tag matches
      if (post.tags.some((tag) => likedTags.includes(tag))) {
        score += 3;
      }

      // Assign points based on swiped tag matches
      if (post.tags.forEach((tag) => swipedTags.includes(tag))) {
        score += 4;
      }

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score) // Sort posts by score in descending order
    .slice(0, 5);
}
