using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace BlogSite.Api.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;

        [ForeignKey("Blog")]
        [JsonIgnore]
        public int BlogId { get; set; }
        [JsonIgnore]
        public Blog Blog { get; set; }

        [ForeignKey("User")]
        [JsonIgnore]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [Required]
        [JsonIgnore]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
