using BlogSite.Api.Data;
using BlogSite.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogSite.Api.Endpoints
{
    public static class LoginEndPoints
    {
        public static void MapLoginEndpoints(this WebApplication app)
        {
            app.MapPost("/login", Login);
        }

        public static async Task<IResult> Login(BlogDbContext db, LoginRequest loginRequest, IConfiguration configuration)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginRequest.Username);
            if (user != null && BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                var token = GenerateJwtToken(user.Username, configuration);
                return Results.Ok(new { token });
            }
            return Results.Unauthorized();
        }

        public static string GenerateJwtToken(string username, IConfiguration configuration)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("Username", username)
            };

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                //claims: new[] { new Claim(ClaimTypes.Name, username) },
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
