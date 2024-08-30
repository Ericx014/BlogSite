namespace BlogSite.Api.Models
{
    public class NewCommentRequest
    {
        public string Content { get; set; }
        public int BlogId { get; set; }
        public string Username { get; set; }
    }
}
