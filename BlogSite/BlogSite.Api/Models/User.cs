using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BCrypt.Net;

namespace BlogSite.Api.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Blog>? Blogs { get; set; } = new List<Blog>();
        [JsonIgnore]
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();

        [JsonIgnore]
        public ICollection<BlogLike> BlogLikes { get; set; } = new List<BlogLike>();
        [JsonIgnore]
        public ICollection<BlogDislike> BlogDislikes { get; set; } = new List<BlogDislike>();
        public void SetPassword(string password)
        {
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
        }
    }
}
