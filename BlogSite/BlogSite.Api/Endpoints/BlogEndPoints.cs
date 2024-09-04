using BlogSite.Api.Data;
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
            app.MapGet("/blogs/{id}", GetBlog).RequireAuthorization();
            app.MapPost("/blogs", CreateBlog).RequireAuthorization();
            app.MapDelete("/blogs", DeleteAllBlogs);
            app.MapDelete("/blogs/{id}", DeleteBlog).RequireAuthorization();
            app.MapPut("/blogs/{id}", UpdateBlog).RequireAuthorization();
            app.MapPatch("/blogs/{id}/AddLike", AddLike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/AddDislike", AddDislike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/RemoveLike", RemoveLike).RequireAuthorization();
            app.MapPatch("/blogs/{id}/RemoveDislike", RemoveDislike).RequireAuthorization();
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
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new CommentSimpleDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        DateCreated = c.DateCreated
                    }).ToList(),
                    Likes = b.Likes,
                    Dislikes = b.Dislikes
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
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new CommentSimpleDto
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
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User,
                    Comments = b.Comments.Select(c => new CommentSimpleDto
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

        private static async Task<IResult> GetBlog(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.Include(b => b.User).FirstOrDefaultAsync(b => b.Id == id);
            return blog is not null ? Results.Ok(blog) : Results.NotFound();
        }

        private static async Task<IResult> CreateBlog(BlogDbContext db, Blog blog, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }
            blog.UserId = userId;
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

        private static async Task<IResult> AddLike(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                blog.Likes++;
                await db.SaveChangesAsync();
                return Results.Ok(blog);
            }
            return Results.NotFound($"Blog with id of {id} is not found");
        }

        private static async Task<IResult> AddDislike(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                blog.Dislikes++;
                await db.SaveChangesAsync();
                return Results.Ok(blog);
            }
            return Results.NotFound($"Blog with id of {id} is not found");
        }

        private static async Task<IResult> RemoveLike(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                blog.Likes--;
                await db.SaveChangesAsync();
                return Results.Ok(blog);
            }
            return Results.NotFound($"Blog with id of {id} is not found");
        }

        private static async Task<IResult> RemoveDislike(BlogDbContext db, int id)
        {
            var blog = await db.Blogs.FindAsync(id);
            if (blog is not null)
            {
                blog.Dislikes--;
                await db.SaveChangesAsync();
                return Results.Ok(blog);
            }
            return Results.NotFound($"Blog with id of {id} is not found");
        }
    }
}
