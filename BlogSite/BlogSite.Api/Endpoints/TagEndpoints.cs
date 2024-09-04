using BlogSite.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogSite.Api.Endpoints
{
    public static class TagEndpoints
    {
        public static void MapTagEndpoints(this WebApplication app) {
            app.MapGet("/tags", GetAllTags);
        }

        public static async Task<IResult> GetAllTags (BlogDbContext db)
        {
            var tags = await db.Tags.ToListAsync();
            return Results.Ok(tags);
        }
    }   
}
