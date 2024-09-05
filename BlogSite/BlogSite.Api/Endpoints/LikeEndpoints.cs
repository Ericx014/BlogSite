using BlogSite.Api.Data;
using BlogSite.Api.DTOs;
using BlogSite.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace BlogSite.Api.Endpoints
{
    public static class LikeEndpoints
    {
        public static void MapLikeEndpoints(this WebApplication app)
        {
            app.MapPost("/blogs/{blogId}/addlike/{userId}", AddLike).RequireAuthorization();
            app.MapPost("/blogs/{blogId}/adddislike/{userId}", AddDislike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/removelike{userId}", RemoveLike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/removedislike{userId}", RemoveDislike).RequireAuthorization();
        }

        private static async Task<IResult> AddLike(BlogDbContext db, int blogId, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user is null)
            {
                return Results.NotFound($"User with id of {userId} is not found");
            }

            var blog = await db.Blogs
                .Include(b => b.BlogLikes)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.BlogLikes.Any(bl => bl.UserId == userId))
            {
                return Results.BadRequest("User has already liked this blog.");
            }
            var BlogLike = new BlogLike { Blog = blog, User = user };
            user.BlogLikes.Add(BlogLike);
            blog.BlogLikes.Add(BlogLike);
            await db.SaveChangesAsync();
            return Results.Ok(new { Blog = blog, User = user, Message = "Like added successfully." });
        }

        private static async Task<IResult> AddDislike(BlogDbContext db, int blogId, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user is null)
            {
                return Results.NotFound($"User with id of {userId} is not found");
            }

            var blog = await db.Blogs
                .Include(b => b.BlogDislikes)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.BlogDislikes.Any(bd => bd.UserId == userId))
            {
                return Results.BadRequest("User has already disliked this blog.");
            }
            var BlogDislike = new BlogDislike { Blog = blog, User = user };
            user.BlogDislikes.Add(BlogDislike);
            blog.BlogDislikes.Add(BlogDislike);
            await db.SaveChangesAsync();
            return Results.Ok(new { Blog = blog, User = user, Message = "Dislike added successfully." });
        }

        public static async Task<IResult> RemoveLike(BlogDbContext db, int blogId, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user is null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await db.Blogs
                .Include(b => b.BlogLikes)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            var blogLike = blog.BlogLikes.FirstOrDefault(bl => bl.UserId == userId);
            if (blogLike == null)
            {
                return Results.BadRequest("User has not liked this blog.");
            }
            blog.BlogLikes.Remove(blogLike);
            user.BlogLikes.Remove(blogLike);
            db.BlogLikes.Remove(blogLike);

            await db.SaveChangesAsync();
            return Results.Ok(new { Blog = blog, User = user, Message = "Like removed successfully." });
        }

        public static async Task<IResult> RemoveDislike(BlogDbContext db, int blogId, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user is null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await db.Blogs
                .Include(b => b.BlogLikes)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            var blogDislike = blog.BlogDislikes.FirstOrDefault(bl => bl.UserId == userId);
            if (blogDislike == null)
            {
                return Results.BadRequest("User has not liked this blog.");
            }
            blog.BlogDislikes.Remove(blogDislike);
            user.BlogDislikes.Remove(blogDislike);
            db.BlogDislikes.Remove(blogDislike);

            await db.SaveChangesAsync();
            return Results.Ok(new { Blog = blog, User = user, Message = "Dislike removed successfully." });
        }
    }
}
