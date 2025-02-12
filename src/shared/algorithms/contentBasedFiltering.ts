import { CategoriesDto } from 'src/modules/feed/dto/feed.dto';

export function contentBased(
  likedCategories: CategoriesDto[],
  likedTags: CategoriesDto[],
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

      // Assign points based on tag matches
      if (post.tags.some((tag) => likedTags.includes(tag))) {
        score += 3;
      }

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score); // Sort posts by score in descending order
  //.slice(0, 10);  Return only the top 10 posts for pagination
}
