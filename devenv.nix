{ pkgs, ... }:

{
  languages.typescript.enable = true;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
  };
}
