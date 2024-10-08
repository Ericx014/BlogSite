﻿using BlogSite.Api.Data;
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
            app.MapGet("/tags/{blogId}", GetTags);
            app.MapPost("/blogs/{blogId}/tags/{userId}", AddTagToBlog).RequireAuthorization();
            app.MapDelete("/blogs/{blogId}/tags/{tagName}/{userId}", RemoveTagFromBlog).RequireAuthorization();
        }

        public static async Task<IResult> GetAllTags (BlogDbContext db)
        {
            var tags = await db.Tags.ToListAsync();
            return Results.Ok(tags);
        }

        public static async Task<IResult> GetTags(BlogDbContext db, int blogId)
        {
            var blog = await FindBlogWithTag(db, blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }
            var tags = blog.BlogTags.Select(bt => bt.Tag.TagName).ToList();

            return Results.Ok(tags);
        }

        public static async Task<IResult> AddTagToBlog(BlogDbContext db, int blogId, int userId, [FromBody] List<string> tags)
        {
            var user = await FindUser(db, userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await FindBlogWithTag(db, blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Only authors can add tags");
            }

            var uniqueTagNames = new HashSet<string>(tags);
            foreach (var tagName in uniqueTagNames)
            {
                var tag = await db.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    db.Tags.Add(tag);
                }
                if (!blog.BlogTags.Any(bt => bt.TagId == tag.Id))
                {
                    var blogTag = new BlogTag { Blog = blog, Tag = tag };
                    db.BlogTag.Add(blogTag);
                }
                else
                {
                    return Results.BadRequest("Cannot duplicate BlogTag");
                }
            }
            await db.SaveChangesAsync();
            return Results.Created($"/blogs/{blogId}", new { uniqueTagNames, blog, message = "Tags added to blog successfully" });
        }

        public static async Task<IResult> RemoveTagFromBlog(BlogDbContext db, int blogId, int userId, string tagName)
        {
            var user = await FindUser(db, userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await FindBlogWithTag(db, blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Only authors can remove tags");
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

        public static async Task<Blog> FindBlogWithTag(BlogDbContext db, int blogId)
        {
            var blog = await db.Blogs
                .Include(b => b.BlogTags).ThenInclude(bt => bt.Tag)
                .FirstOrDefaultAsync(b => b.Id == blogId);
            return blog;
        }
    }   
}
