{ pkgs, ... }:

{
  languages.python = {
    enable = true;
    venv = {
      enable = true;
      requirements = ''
        letterboxdpy
      '';
    };
  };

  languages.typescript.enable = true;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
  };
}
