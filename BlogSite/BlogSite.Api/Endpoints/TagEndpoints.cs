using BlogSite.Api.Data;
using BlogSite.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace BlogSite.Api.Endpoints
{
    public static class TagEndpoints
    {
        public static void MapTagEndpoints(this WebApplication app) {
            app.MapGet("/tags", GetAllTags);
            app.MapPost("/blogs/addtag/{blogId}/{userId}", AddTagToBlog).RequireAuthorization();
            app.MapDelete("/blogs/removetag/{blogId}/{userId}", RemoveTagFromBlog).RequireAuthorization();
        }

        public static async Task<IResult> GetAllTags (BlogDbContext db)
        {
            var tags = await db.Tags.ToListAsync();
            return Results.Ok(tags);
        }

        public static async Task<IResult> AddTagToBlog(BlogDbContext db, int blogId, int userId, [FromBody] List<string> tags)
        {
            var user = await FindUser(db, userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await FindBlog(db, blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Only authors can add tags");
            }

            foreach (var tagName in tags)
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
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        public static async Task<IResult> RemoveTagFromBlog(BlogDbContext db, int blogId, int userId, string tagName)
        {
            var user = await FindUser(db, userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await FindBlog(db, blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Only authors can add tags");
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

        public static async Task<User> FindUser(BlogDbContext db, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            return user;
        }

        public static async Task<Blog> FindBlog(BlogDbContext db, int blogId)
        {
            var blog = await db.Blogs
                .Include(b => b.BlogTags).ThenInclude(bt => bt.Tag)
                .FirstOrDefaultAsync(b => b.Id == blogId);
            return blog;
        }
    }   
}
