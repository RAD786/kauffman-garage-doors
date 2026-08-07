# Dev-only. Characterises the logo's existing alpha channel and looks for the
# two things that make a "transparent" PNG still look wrong on a light
# background: dark matting fringes, and a semi-opaque dark halo.
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Text;

public static class AlphaTool
{
    public static byte[] Load(string path, out int w, out int h, out int stride)
    {
        Bitmap bmp = new Bitmap(path);
        w = bmp.Width; h = bmp.Height;
        BitmapData d = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        stride = d.Stride;
        byte[] buf = new byte[stride*h];
        Marshal.Copy(d.Scan0, buf, 0, buf.Length);
        bmp.UnlockBits(d);
        bmp.Dispose();
        return buf;
    }

    public static string AlphaHistogram(byte[] p, int stride, int w, int h)
    {
        long a0=0, aLow=0, aMid=0, aHigh=0, a255=0;
        for (int y=0;y<h;y++) for (int x=0;x<w;x++)
        {
            int a = p[y*stride+x*4+3];
            if (a==0) a0++; else if (a<64) aLow++; else if (a<192) aMid++;
            else if (a<255) aHigh++; else a255++;
        }
        long t=(long)w*h;
        return string.Format("a=0:{0:P1}  1-63:{1:P1}  64-191:{2:P1}  192-254:{3:P1}  a=255:{4:P1}",
            a0/(double)t, aLow/(double)t, aMid/(double)t, aHigh/(double)t, a255/(double)t);
    }

    // Semi-transparent pixels that are DARK are the ones that show up as grime
    // when the logo is placed on a white background.
    public static string DarkFringe(byte[] p, int stride, int w, int h)
    {
        long semi=0, semiDark=0; double sumLum=0;
        for (int y=0;y<h;y++) for (int x=0;x<w;x++)
        {
            int i=y*stride+x*4;
            int a=p[i+3];
            if (a>8 && a<248)
            {
                semi++;
                double lum = 0.299*p[i+2]+0.587*p[i+1]+0.114*p[i];
                sumLum += lum;
                if (lum < 60) semiDark++;
            }
        }
        if (semi==0) return "no semi-transparent pixels at all (hard-edged alpha)";
        return string.Format("semi-transparent px: {0}  of which dark(lum<60): {1} ({2:P1})  mean lum {3:F0}",
            semi, semiDark, semiDark/(double)semi, sumLum/semi);
    }

    // Tight bounding box of anything actually visible (alpha above threshold).
    public static string VisibleBounds(byte[] p, int stride, int w, int h, int aMin)
    {
        int minX=w, minY=h, maxX=-1, maxY=-1;
        for (int y=0;y<h;y++) for (int x=0;x<w;x++)
        {
            if (p[y*stride+x*4+3] > aMin)
            {
                if(x<minX)minX=x; if(x>maxX)maxX=x;
                if(y<minY)minY=y; if(y>maxY)maxY=y;
            }
        }
        if (maxX<0) return "nothing visible";
        return string.Format("alpha>{0}: x {1}..{2}  y {3}..{4}  (w={5} h={6})",
            aMin, minX, maxX, minY, maxY, maxX-minX+1, maxY-minY+1);
    }

    // Composite onto a flat colour so we can eyeball the real-world result.
    public static void Composite(string src, string dst, int br, int bg, int bb, int size)
    {
        Bitmap s = new Bitmap(src);
        Bitmap o = new Bitmap(size, size);
        using (Graphics g = Graphics.FromImage(o))
        {
            g.Clear(Color.FromArgb(255, br, bg, bb));
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.DrawImage(s, 0, 0, size, size);
        }
        o.Save(dst, ImageFormat.Png);
        o.Dispose(); s.Dispose();
    }
}
"@ -ReferencedAssemblies System.Drawing

$src = "c:\Users\ryana\kauffman-garage-doors\public\images\logo.png"
$out = "c:\Users\ryana\kauffman-garage-doors\.audit"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$w=0; $h=0; $stride=0
$px = [AlphaTool]::Load($src, [ref]$w, [ref]$h, [ref]$stride)

"alpha histogram:"
"  " + [AlphaTool]::AlphaHistogram($px, $stride, $w, $h)
""
"dark fringe check:"
"  " + [AlphaTool]::DarkFringe($px, $stride, $w, $h)
""
"visible bounds:"
"  " + [AlphaTool]::VisibleBounds($px, $stride, $w, $h, 8)
"  " + [AlphaTool]::VisibleBounds($px, $stride, $w, $h, 128)

[AlphaTool]::Composite($src, "$out\logo-on-white.png", 255,255,255, 420)
[AlphaTool]::Composite($src, "$out\logo-on-navy.png",  11,37,69,   420)
"composites written: logo-on-white.png, logo-on-navy.png"
