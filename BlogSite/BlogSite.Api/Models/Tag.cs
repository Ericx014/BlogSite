using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BlogSite.Api.Models
{
    public class Tag
    {
        [Key]
        [JsonIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string TagName { get; set; }
        [JsonIgnore]
        public ICollection<BlogTag> BlogTags { get; set; } = new List<BlogTag>();
    }
}
