# Regenerates the derived logo assets from public/images/logo.png.
# The source is already RGBA with a clean transparent background, so this only
# crops to the real art bounds and builds the favicons. Re-run if the client
# ever supplies new artwork.
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

public static class LogoBuild
{
    // Tight crop to everything with meaningful alpha, plus a small margin.
    public static string CropToArt(string src, string dst, int margin, int alphaMin)
    {
        Bitmap s = new Bitmap(src);
        int minX=s.Width, minY=s.Height, maxX=-1, maxY=-1;
        for (int y=0;y<s.Height;y++)
          for (int x=0;x<s.Width;x++)
            if (s.GetPixel(x,y).A > alphaMin)
            { if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }

        minX = Math.Max(0, minX-margin); minY = Math.Max(0, minY-margin);
        maxX = Math.Min(s.Width-1, maxX+margin); maxY = Math.Min(s.Height-1, maxY+margin);
        int w = maxX-minX+1, h = maxY-minY+1;

        Bitmap o = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(o))
        {
            g.CompositingMode = CompositingMode.SourceCopy;
            g.DrawImage(s, new Rectangle(0,0,w,h), new Rectangle(minX,minY,w,h), GraphicsUnit.Pixel);
        }
        o.Save(dst, ImageFormat.Png);
        string info = string.Format("{0}x{1} (from {2},{3})", w, h, minX, minY);
        o.Dispose(); s.Dispose();
        return info;
    }

    // Proportional downscale, preserving alpha.
    public static string Downscale(string src, string dst, int maxW)
    {
        Bitmap s = new Bitmap(src);
        if (s.Width <= maxW) { string same = s.Width + "x" + s.Height + " (unchanged)"; s.Dispose(); return same; }
        int w = maxW, h = (int)Math.Round(s.Height * (maxW / (double)s.Width));
        Bitmap o = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(o))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawImage(s, 0, 0, w, h);
        }
        s.Dispose();
        o.Save(dst, ImageFormat.Png);
        o.Dispose();
        return w + "x" + h;
    }

    // Favicon: the mark centred on a solid navy square. A transparent favicon
    // with navy artwork would vanish in a dark browser tab, so it gets a
    // background on purpose -- this is the one place we want one.
    public static void Favicon(string src, string dst, int size, int pad, bool rounded)
    {
        Bitmap s = new Bitmap(src);
        Bitmap o = new Bitmap(size, size, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(o))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;

            using (SolidBrush b = new SolidBrush(Color.FromArgb(255, 11, 37, 69)))
            {
                if (rounded)
                {
                    int r = size/5;
                    using (System.Drawing.Drawing2D.GraphicsPath p = new System.Drawing.Drawing2D.GraphicsPath())
                    {
                        p.AddArc(0,0,r,r,180,90); p.AddArc(size-r,0,r,r,270,90);
                        p.AddArc(size-r,size-r,r,r,0,90); p.AddArc(0,size-r,r,r,90,90);
                        p.CloseFigure();
                        g.FillPath(b, p);
                    }
                }
                else g.FillRectangle(b, 0, 0, size, size);
            }

            int avail = size - pad*2;
            double scale = Math.Min(avail/(double)s.Width, avail/(double)s.Height);
            int dw = (int)Math.Round(s.Width*scale), dh = (int)Math.Round(s.Height*scale);
            g.DrawImage(s, (size-dw)/2, (size-dh)/2, dw, dh);
        }
        o.Save(dst, ImageFormat.Png);
        o.Dispose(); s.Dispose();
    }
}
"@ -ReferencedAssemblies System.Drawing

$root = "c:\Users\ryana\kauffman-garage-doors"
$logo = "$root\public\images\logo.png"
$mark = "$root\public\images\logo-mark.png"
$schema = "$root\public\images\logo-schema.png"

"logo-mark.png   : " + [LogoBuild]::CropToArt($logo, $mark, 10, 8)

# Downscale the wordmark. The full-resolution crop was ~500KB and is only ever
# rendered at ~120px; next/image resamples anyway, so the large source bought
# nothing and slowed every optimiser pass.
"logo-mark.png   : downscaled to " + [LogoBuild]::Downscale($mark, $mark, 640)

# Square, opaque logo for JSON-LD and Google Business Profile. Crawlers and
# social scrapers fetch this URL raw -- it must not be the 1.2MB original.
[LogoBuild]::Favicon($mark, $schema, 512, 56, $false)

[LogoBuild]::Favicon($mark, "$root\src\app\icon.png", 96, 10, $false)
[LogoBuild]::Favicon($mark, "$root\src\app\apple-icon.png", 180, 22, $true)

foreach ($f in @($logo, $mark, $schema, "$root\src\app\icon.png", "$root\src\app\apple-icon.png")) {
  $i = New-Object System.Drawing.Bitmap $f
  "{0,-18} {1}x{2}  {3:N0} bytes" -f (Split-Path $f -Leaf), $i.Width, $i.Height, (Get-Item $f).Length
  $i.Dispose()
}
