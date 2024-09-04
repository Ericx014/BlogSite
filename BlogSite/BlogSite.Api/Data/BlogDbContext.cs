using BlogSite.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogSite.Api.Data
{
    public class BlogDbContext : DbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options)
            : base(options) { }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<BlogTag> BlogTag { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }
        public DbSet<BlogDislike> BlogDislikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Blogs)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Blog>()
                .HasMany(b => b.Comments)
                .WithOne(c => c.Blog)
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.Cascade);                

            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Blog>()
                .Property(b => b.DateCreated)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<BlogTag>()
                .HasKey(bt => new { bt.BlogId, bt.TagId });

            modelBuilder.Entity<BlogTag>()
                .HasOne(bt => bt.Blog)
                .WithMany(b => b.BlogTags)
                .HasForeignKey(bt => bt.BlogId);

            modelBuilder.Entity<BlogTag>()
                .HasOne(bt => bt.Tag)
                .WithMany(t => t.BlogTags)
                .HasForeignKey(bt => bt.TagId);

            modelBuilder.Entity<BlogLike>()
                .HasKey(bl => new {bl.BlogId, bl.UserId});

            modelBuilder.Entity<BlogLike>()
                .HasOne(bl => bl.Blog)
                .WithMany(b => b.BlogLikes)
                .HasForeignKey(bl => bl.BlogId);

            modelBuilder.Entity<BlogLike>()
                .HasOne(bl => bl.User)
                .WithMany(u => u.BlogLikes)
                .HasForeignKey(bl => bl.UserId);

            modelBuilder.Entity<BlogDislike>()
                .HasKey(bd => new { bd.BlogId, bd.UserId });

            modelBuilder.Entity<BlogDislike>()
                .HasOne(bd => bd.Blog)
                .WithMany(b => b.BlogDislikes)
                .HasForeignKey(bd => bd.BlogId);

            modelBuilder.Entity<BlogDislike>()
                .HasOne(bd => bd.User)
                .WithMany(u => u.BlogDislikes)
                .HasForeignKey(bd => bd.UserId);
        }
    }
}