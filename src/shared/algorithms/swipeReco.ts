import { CategoriesDto } from 'src/modules/feed/dto/feed.dto';

export function swipeReco(
  likedCategories: CategoriesDto[],
  likedTags: CategoriesDto[],
  dislikedCategories: CategoriesDto[],
  dislikedTags: CategoriesDto[],
  allPosts: any[],
) {
  return allPosts
    .map((post) => {
      let score = 0;

      //Give positive points if post matches liked categories
      if (
        post.categories.some((category) => likedCategories.includes(category))
      ) {
        score += 5;
      }

      //Penalize posts if they match disliked categories
      if (
        post.categories.some((category) =>
          dislikedCategories.includes(category),
        )
      ) {
        score -= 5;
      }

      // Give positive points if post matches liked tags
      if (post.tags.some((tag) => likedTags.includes(tag))) {
        score += 3;
      }

      //Penalize posts if they match disliked tags
      if (post.tags.some((tag) => dislikedTags.includes(tag))) {
        score -= 3;
      }

      //Reduce the impact of old swipes to keep recommendations fresh
      const decayFactor = 0.9;
      const daysSincePosted =
        (Date.now() - new Date(post.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      score *= Math.pow(decayFactor, daysSincePosted);

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score) // Sort posts by highest score
    .slice(0, 5); // Return only top 5 posts
}
