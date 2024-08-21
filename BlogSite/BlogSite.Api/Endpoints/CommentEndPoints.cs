using BlogSite.Api.Data;
using BlogSite.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogSite.Api.Endpoints
{
    public static class CommentEndPoints
    {
        public static void MapCommentEndPoints(this WebApplication app)
        {
            app.MapGet("/comments", GetComments);
            app.MapPost("/comments", CreateComment);
            app.MapDelete("/comments/{id}", DeleteComments);
        }

        public static async Task<IResult> GetComments(BlogDbContext db)
        {
            var allComments = await db.Comments.ToListAsync();
            return Results.Ok(allComments);
        }
        public static async Task<IResult> CreateComment(BlogDbContext db, Comment comment, int blogId)
        {
            var blog = await db.Blogs.FindAsync(blogId);
            if (blog == null)
            {
                return Results.NotFound($"Blog with ID {blogId} not found.");
            }

            comment.BlogId = blogId;
            db.Comments.Add(comment);
            blog.Comments.Add(comment);
            await db.SaveChangesAsync();
            return Results.Created($"/comments/{comment.Id}", comment);
        }
        public static async Task<IResult> DeleteComments(BlogDbContext db, int id)
        {
            var commentToDelete = await db.Comments.FindAsync(id);
            if (commentToDelete is not null)
            {
                db.Comments.Remove(commentToDelete);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
            return Results.NotFound();
        }
    }
}
