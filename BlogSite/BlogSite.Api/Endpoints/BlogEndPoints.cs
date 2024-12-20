﻿using BlogSite.Api.Data;
using BlogSite.Api.DTOs;
using BlogSite.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static BlogSite.Api.DTOs.BlogDTO;
using static BlogSite.Api.DTOs.UserDTO;

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
            app.MapGet("/blogs/{userId}/userliked", GetUserLikedBlogs).RequireAuthorization();
            app.MapGet("/blogs/{userId}/userdisliked/", GetUserDislikedBlogs).RequireAuthorization();
            app.MapPost("/blogs", CreateBlog).RequireAuthorization();
            app.MapDelete("/blogs/{blogId}/{userId}", DeleteBlog).RequireAuthorization();
            app.MapPatch("/blogs/{blogId}/{userId}", UpdateBlogContent).RequireAuthorization();
            //app.MapDelete("/blogs", DeleteAllBlogs);
            app.MapGet("/blogs/search", SearchBlogs).RequireAuthorization();
        }

        private static async Task<IResult> GetAllBlogs(BlogDbContext db, ClaimsPrincipal user)
        {
            var currentUsername = user.FindFirstValue("Username");
            if (currentUsername == null)
            {
                return Results.Json(new { message = "You must be logged in to access blogs." }, statusCode: 401);
            }

            var allBlogs = await db.Blogs
                .Include(b => b.User)
                .Include(b => b.BlogTags)
                    .ThenInclude(bt => bt.Tag)
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User.Username,
                    BloggerEmail = b.User.Email,
                    Category = b.Category,
                    Tags = b.BlogTags.Select(bt => bt.Tag.TagName).ToList()
                })
                .ToListAsync();

            return Results.Ok(allBlogs);
        }
        private static async Task<IResult> GetUserBlogs(BlogDbContext db, ClaimsPrincipal user)
        {
            var currentUsername = user.FindFirstValue("Username");
            if (currentUsername == null)
            {
                return Results.Json(new { message = "You must be logged in to access blogs." }, statusCode: 401);
            }

            var blogsToReturn = await db.Blogs
                .Include(b => b.User)
                .Include(b => b.BlogTags)
                    .ThenInclude(bt => bt.Tag)
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User.Username,
                    BloggerEmail = b.User.Email,
                    Category = b.Category,
                    Tags = b.BlogTags.Select(bt => bt.Tag.TagName).ToList()
                })
                .ToListAsync();

            return Results.Ok(blogsToReturn);
        }

        private static async Task<IResult> GetCategoryBlogs(BlogDbContext db, [FromRoute] string category)
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return Results.BadRequest("Category field cannot be empty.");
            }

            var categoryBlogs = await db.Blogs
                .Include(b => b.User)
                .Where(b => b.Category == category)
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User.Username
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
                .Include(b => b.User)
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = new UserDto
                    {
                        Id = b.User.Id,
                        Username = b.User.Username,
                        Email = b.User.Email,
                        Blogs = new List<BlogSimpleDto>()
                    },
                    LikesCount = b.BlogLikes.Count,
                    DislikesCount = b.BlogDislikes.Count,
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
            var blog = await db.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.BlogTags)
                    .ThenInclude(bt => bt.Tag)
                .Include(b => b.BlogLikes)
                .Include(b => b.BlogDislikes)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {id} not found.");
            }

            var blogDto = new BlogDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                Blogger = new UserDto
                {
                    Id = blog.User.Id,
                    Username = blog.User.Username,
                    Email = blog.User.Email,
                    Blogs = new List<BlogSimpleDto>()
                },
                Comments = blog.Comments.Select(c => new CommentSimpleDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    UserId = c.UserId,
                    User = c.User.Username,
                    DateCreated = c.DateCreated
                }).ToList(),
                LikesCount = blog.BlogLikes.Count,
                DislikesCount = blog.BlogDislikes.Count,
                Tags = blog.BlogTags.Select(bt => bt.Tag.TagName).ToList(),
                Category = blog.Category,
                DateCreated = blog.DateCreated,
                DateUpdated = blog.DateUpdated
            };

            return Results.Ok(blogDto);
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
                Id = bl.Blog.Id,
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

            if (request.Tags != null && request.Tags.Any())
            {
                var uniqueTagsToAdd = new HashSet<string>(request.Tags);
                foreach (var tagName in uniqueTagsToAdd)
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
                        return Results.BadRequest("BlogTag cannot be duplicated");
                    }
                }
            }

            db.Blogs.Add(blog);
            user.Blogs.Add(blog);
            await db.SaveChangesAsync();
            return Results.Created($"/blogs/{blog.Id}", new { blog, message = "Blog created successfully" });
        }

        private static async Task<IResult> DeleteAllBlogs(BlogDbContext db)
        {
            db.Blogs.RemoveRange(db.Blogs);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteBlog(BlogDbContext db, int blogId, int userId)
        {
            var user = await db.Users.FindAsync(userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await db.Blogs.FindAsync(blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Blogs can only be deleted by authors");
            }
            db.Blogs.Remove(blog);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> UpdateBlogContent(BlogDbContext db, int blogId, int userId, [FromBody] Blog requestBlog)
        {
            var user = await db.Users.FindAsync(userId);
            if (user == null)
            {
                return Results.NotFound($"User with ID {userId} not found.");
            }

            var blog = await db.Blogs
                .Include(b => b.BlogTags)
                .ThenInclude(bt => bt.Tag)
                .FirstOrDefaultAsync(b => b.Id == blogId);

            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            if (blog.UserId != userId)
            {
                return Results.BadRequest("Blogs can only be editted by authors");
            }

            blog.Content = requestBlog.Content;
            //blog.Category = requestBlog.Category;
            blog.DateUpdated = DateTime.UtcNow;

            //var newTagNames = request.Blog.BlogTags.Select(bt => bt.Tag.TagName.ToLower()).ToList();
            //var existingTagNames = blog.BlogTags.Select(bt => bt.Tag.TagName.ToLower()).ToList();

            //var tagsToRemove = blog.BlogTags.Where(bt => !newTagNames.Contains(bt.Tag.TagName.ToLower())).ToList();
            //foreach (var tagToRemove in tagsToRemove)
            //{
            //    blog.BlogTags.Remove(tagToRemove);
            //}

            //foreach (var newTagName in newTagNames)
            //{
            //    if (!existingTagNames.Contains(newTagName))
            //    {
            //        var tag = await db.Tags.FirstOrDefaultAsync(t => t.TagName.ToLower() == newTagName);
            //        if (tag == null)
            //        {
            //            tag = new Tag { TagName = newTagName };
            //            db.Tags.Add(tag);
            //        }
            //        blog.BlogTags.Add(new BlogTag { Blog = blog, Tag = tag });
            //    }
            //}

            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> SearchBlogs(
            BlogDbContext db,
            [FromQuery] string? query,
            [FromQuery] string? category,
            [FromQuery] string? tag)
        {
            var blogsQuery = db.Blogs
                .Include(b => b.User)
                .Include(b => b.BlogTags)
                    .ThenInclude(bt => bt.Tag)
                .AsQueryable();

            if (string.IsNullOrWhiteSpace(query) &&
                string.IsNullOrWhiteSpace(category) &&
                string.IsNullOrWhiteSpace(tag))
            {
                return Results.Ok(new List<object>()); // Return an empty list if no search criteria
            }

            if (!string.IsNullOrWhiteSpace(query))
            {
                blogsQuery = blogsQuery.Where(b =>
                    b.Title.ToLower().Contains(query.ToLower()) ||
                    b.Content.ToLower().Contains(query.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                //blogsQuery = blogsQuery.Where(b =>
                //    b.Category.Contains(query));
                blogsQuery = blogsQuery.Where(b => b.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(tag))
            {
                blogsQuery = blogsQuery.Where(b =>
                    b.BlogTags.Any(bt => bt.Tag.TagName == tag));
            }

            //if (fromDate.HasValue)
            //{
            //    blogsQuery = blogsQuery.Where(b => b.DateCreated >= fromDate.Value);
            //}

            //if (toDate.HasValue)
            //{
            //    blogsQuery = blogsQuery.Where(b => b.DateCreated <= toDate.Value);
            //}

            var searchResults = await blogsQuery
                .Select(b => new
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Blogger = b.User.Username,
                    Category = b.Category,
                    Tags = b.BlogTags.Select(bt => bt.Tag.TagName).ToList(),
                    DateCreated = b.DateCreated
                })
                .ToListAsync();


            return Results.Ok(searchResults);
        }
    }
}
