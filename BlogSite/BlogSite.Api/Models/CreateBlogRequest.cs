namespace BlogSite.Api.Models
{
    public class CreateBlogRequest
    {
        public Blog Blog { get; set; }
        public List<string> Tags { get; set; }
        public int UserId { get; set; }
    }

}
