using BlogSite.Api.Data;
using BlogSite.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using static BlogSite.Api.DTOs.UserDTO;

namespace BlogSite.Api.NewFolder
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this WebApplication app)
        {
            app.MapGet("/users", GetAllUsers);
            app.MapPost("/users", CreateUser);
            app.MapDelete("/users/{id}", DeleteUser);
            app.MapDelete("/users", DeleteAllUser);
        }

        private static async Task<IResult> GetAllUsers(BlogDbContext db)
        {
            var allUsers = await db.Users
                .Include(u => u.Blogs)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Blogs = u.Blogs.Select(b => new BlogSimpleDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Content = b.Content,
                    }).ToList()
                })
                .ToListAsync();
            return Results.Ok(allUsers);
        }

        private static async Task<IResult> CreateUser(BlogDbContext db, [FromBody] NewUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || request.Username.Length < 6)
            {
                return Results.BadRequest("Username must be at least 6 characters long and cannot be empty.");
            }

            var passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
            if (string.IsNullOrWhiteSpace(request.Password) || !Regex.IsMatch(request.Password, passwordPattern))
            {
                return Results.BadRequest("Password must be at least 8 characters long, contain at least uppercase letter, one lowercase letter, one digit number and one special symbol.");
            }

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (string.IsNullOrWhiteSpace(request.Email) || !Regex.IsMatch(request.Email, emailPattern))
            {
                return Results.BadRequest("Invalid email format.");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
            };

            user.SetPassword(request.Password);
            db.Users.Add(user);
            await db.SaveChangesAsync();
            return Results.Created($"/user/{user.Id}", user);
        }

        private static async Task<IResult> DeleteUser(BlogDbContext db, int id)
        {
            var userToDelete = await db.Users.FindAsync(id);
            if (userToDelete == null)
            {
                return Results.NotFound();
            }

            db.Users.Remove(userToDelete);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

        private static async Task<IResult> DeleteAllUser(BlogDbContext db)
        {
            db.Users.RemoveRange(db.Users);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}
