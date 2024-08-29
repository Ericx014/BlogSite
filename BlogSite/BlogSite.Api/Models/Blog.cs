using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BlogSite.Api.Models
{
    public class Blog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        [JsonIgnore]
        [DataType(DataType.DateTime)]
        public DateTime DateCreated { get; set; }
        [JsonIgnore]
        public DateTime? DateUpdated { get; set; } 


        [ForeignKey("User")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();
    }
}
