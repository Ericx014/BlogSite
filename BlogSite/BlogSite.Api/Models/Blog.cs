using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BlogSite.Api.Models
{
    public class Blog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Content { get; set; } = string.Empty;
        [Required]
        public string Category { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<BlogLike> BlogLikes { get; set; } = new List<BlogLike>();
       
        [JsonIgnore]
        public ICollection<BlogDislike> BlogDislikes { get; set; } = new List<BlogDislike>();

        [JsonIgnore]
        [DataType(DataType.DateTime)]
        public DateTime DateCreated { get; set; }
        [JsonIgnore]
        public DateTime? DateUpdated { get; set; } 

        [ForeignKey("User")]
        [JsonIgnore]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();

        [JsonIgnore]
        public ICollection<BlogTag> BlogTags { get; set; } = new List<BlogTag>();
    }
}
