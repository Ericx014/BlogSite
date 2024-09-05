using BlogSite.Api.Data;
using BlogSite.Api.DTOs;
using BlogSite.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static BlogSite.Api.DTOs.BlogDTO;

namespace BlogSite.Api.Endpoints
{
    public static class BlogEndpoints
    {
        public static void MapBlogEndpoints(this WebApplication app)
        {
            app.MapGet("/blogs", GetAllBlogs).RequireAuthorization();
            app.MapGet("/blogs/user", GetUserBlogs).RequireAuthorization();
            app.MapGet("/blogs/category/{category}", GetCategoryBlogs).RequireAuthorization();
            app.MapGet("/blogs/tag/{tagName}", GetTagBlogs).RequireAuthorization();
            app.MapGet("/blogs/{id}", GetBlog).RequireAuthorization();
            app.MapGet("/blogs/userliked/{userId}", GetUserLikedBlogs).RequireAuthorization();
            app.MapGet("/blogs/userdisliked/{userId}", GetUserDislikedBlogs).RequireAuthorization();
            app.MapPost("/blogs", CreateBlog).RequireAuthorization();
            app.MapDelete("/blogs", DeleteAllBlogs);
            app.MapDelete("/blogs/{id}", DeleteBlog).RequireAuthorization();
            app.MapPut("/blogs/{id}", UpdateBlog).RequireAuthorization();
            app.MapPost("/blogs/{blogId}/addlike/{userId}", AddLike).RequireAuthorization();
            app.MapPost("/blogs/{blogId}/adddislike/{userId}", AddDislike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/removelike{userId}", RemoveLike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/removedislike{userId}", RemoveDislike).RequireAuthorization();
            app.MapDelete("/blogs/removetag/{blogId}/{tagName}", RemoveTagFromBlog).RequireAuthorization();
        }

        private static async Task<IResult> GetAllBlogs(BlogDbContext db, ClaimsPrincipal user)
        {
            var currentUsername = user.FindFirstValue("Username");
            if (currentUsername == null)
            {
                return Results.Json(new { message = "You must be logged in to access blogs." }, statusCode: 401);
            }

            var allBlogs = await db.Blogs
                .Include(b => b.Comments)
                .Include(b => b.BlogTags)
                .ThenInclude(bt => bt.Tag)
                .Select(b => new BlogDTO.BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new BlogDTO.CommentSimpleDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        DateCreated = c.DateCreated
                    }).ToList(),
                    Likes = b.BlogLikes.Count,
                    Dislikes = b.BlogDislikes.Count,
                    Tags = b.BlogTags.Select(bt => bt.Tag.TagName).ToList() 
                })
                .ToListAsync();

            return Results.Ok(allBlogs);
        }


        private static async Task<IResult> GetUserBlogs(BlogDbContext db, ClaimsPrincipal user)
        {
            var currentUsername = user.FindFirstValue("Username");

            var allBlogs = await db.Blogs
                .Include(b => b.Comments)
                .Where(b => b.User.Username == currentUsername)
                .Select(b => new BlogDTO.BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new BlogDTO.CommentSimpleDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId
                    }).ToList()
                })
                .ToListAsync();
            return Results.Ok(allBlogs);
        }

        private static async Task<IResult> GetCategoryBlogs(BlogDbContext db, [FromRoute] string category)
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return Results.BadRequest("Category field cannot be empty.");
            }

            var categoryBlogs = await db.Blogs
                .Include(b => b.Comments)
                .Where(b => b.Category == category)
                .Select(b => new BlogDTO.BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new BlogDTO.CommentSimpleDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId
                    }).ToList()
                })
                .ToListAsync();

            if (!categoryBlogs.Any())
            {
                return Results.NotFound($"No blogs found for category '{category}'.");
            }    

            return Results.Ok(categoryBlogs);
        }

        private static async Task<IResult> GetTagBlogs(BlogDbContext db, string tagName)
        {
            if (string.IsNullOrWhiteSpace(tagName))
            {
                return Results.BadRequest("Tag cannot be empty.");
            }

            var tagEntity = await db.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
            if (tagEntity == null) 
            {
                return Results.NotFound($"No blogs with tag {tagName} found.");
            }

            var blogIdWithTag = await db.BlogTag
                .Where(bt => bt.TagId == tagEntity.Id)
                .Select(bt => bt.BlogId)
                .ToListAsync();

            var blogs = await db.Blogs
                .Where(b => blogIdWithTag.Contains(b.Id))
                .Include(b => b.Comments)
                .Include(b => b.BlogTags).ThenInclude(bt => bt.Tag)
                .Select(b => new BlogDTO.BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new BlogDTO.CommentSimpleDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        DateCreated = c.DateCreated
                    }).ToList(),
                    Likes = b.BlogLikes.Count,
                    Dislikes = b.BlogDislikes.Count,
                    Tags = b.BlogTags.Select(bt => bt.Tag.TagName).ToList()
                })
                .ToListAsync();

            if (!blogs.Any())
            {
                return Results.NotFound($"No blogs found for tag {tagName}.");
            }

            return Results.Ok(blogs);
        }

        private static async Task<IResult> GetBlog(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.Include(b => b.User).FirstOrDefaultAsync(b => b.Id == id);
            return blog is not null ? Results.Ok(blog) : Results.NotFound();
        }

        private static async Task<IResult> GetUserLikedBlogs(BlogDbContext db, int userId)
        {
            var user = await db.Users
                .Include(u => u.BlogLikes)
                .ThenInclude(bl => bl.Blog)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var likedBlogs = user.BlogLikes.Select(bl => new 
            {
                Title = bl.Blog.Title,
                Content = bl.Blog.Content
            }).ToList();

            return Results.Ok(likedBlogs);
        }

        private static async Task<IResult> GetUserDislikedBlogs(BlogDbContext db, int userId)
        {
            var user = await db.Users
                .Include(u => u.BlogDislikes)
                .ThenInclude(bl => bl.Blog)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var likedBlogs = user.BlogDislikes.Select(bl => new
            {
                Title = bl.Blog.Title,
                Content = bl.Blog.Content
            }).ToList();

            return Results.Ok(likedBlogs);
        }

        private static async Task<IResult> CreateBlog(BlogDbContext db, [FromBody] CreateBlogRequest request)
        {
            var user = await db.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {request.UserId} not found.");
            }
            var blog = request.Blog;
            blog.UserId = request.UserId;

            foreach (var tagName in request.Tags)
            {
                var tag = await db.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    db.Tags.Add(tag);
                }
                var blogTag = new BlogTag { Blog = blog, Tag = tag };
                blog.BlogTags.Add(blogTag);
            }

            db.Blogs.Add(blog);
            user.Blogs.Add(blog);
            await db.SaveChangesAsync();
            return Results.Created($"/blogs/{blog.Id}", blog);
        }

        private static async Task<IResult> DeleteAllBlogs(BlogDbContext db)
        {
            db.Blogs.RemoveRange(db.Blogs);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteBlog(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                db.Blogs.Remove(blog);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
            return Results.NotFound();
        }

        private static async Task<IResult> UpdateBlog(BlogDbContext db, int id, [FromBody] Blog updatedBlog)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                blog.Content = updatedBlog.Content;
                blog.DateUpdated = DateTime.UtcNow;
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
            return Results.NotFound();
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
        public static async Task<IResult> RemoveTagFromBlog(BlogDbContext db, int blogId, string tagName)
        {
            var blog = await db.Blogs
                .Include(b => b.BlogTags).ThenInclude(bt => bt.Tag)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            var foundBlogTag = blog.BlogTags.FirstOrDefault(bt => bt.Tag.TagName == tagName);

            if (foundBlogTag == null)
            {
                return Results.NotFound($"Tag with name '{tagName}' not found in the blog.");
            }

            blog.BlogTags.Remove(foundBlogTag);
            db.BlogTag.Remove(foundBlogTag);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}
