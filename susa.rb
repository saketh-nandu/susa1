# Homebrew Formula for SUSA Programming Language
class Susa < Formula
  desc "Modern programming language with English-like syntax"
  homepage "https://susastudio.online"
  url "https://github.com/susa-lang/susa/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "REPLACE_WITH_ACTUAL_SHA256"
  license "MIT"
  version "1.0.0"

  depends_on "gcc" => :build if OS.linux?

  def install
    cd "cpp-core" do
      system ENV.cxx, "-std=c++17", "-O2", "main.cpp", "-o", "susa"
      bin.install "susa"
    end

    # Install modules
    (share/"susa/modules").install Dir["modules/*"]
    
    # Install examples
    (share/"susa/examples").install Dir["examples/*"]
    
    # Install documentation
    doc.install "README.md", "LICENSE"
    doc.install "cpp-core/100_PERCENT_COMPLETE.md" => "FEATURES.md" if File.exist?("cpp-core/100_PERCENT_COMPLETE.md")
  end

  test do
    # Create a simple test file
    (testpath/"test.susa").write <<~EOS
      PRINT "Hello from SUSA!"
    EOS
    
    assert_match "Hello from SUSA!", shell_output("#{bin}/susa #{testpath}/test.susa")
  end

  def caveats
    <<~EOS
      SUSA has been installed!
      
      Examples are available at:
        #{HOMEBREW_PREFIX}/share/susa/examples/
      
      Modules are available at:
        #{HOMEBREW_PREFIX}/share/susa/modules/
      
      Documentation:
        #{HOMEBREW_PREFIX}/share/doc/susa/
      
      Get started:
        susa #{HOMEBREW_PREFIX}/share/susa/examples/01_basics.susa
      
      For more information:
        https://susastudio.online
    EOS
  end
end
