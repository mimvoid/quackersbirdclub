{
  description = "Provides tools for developing a Hugo site";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
  let
    allSystems = nixpkgs.lib.genAttrs nixpkgs.lib.platforms.all;

    toSystems = passPkgs: allSystems (system:
      passPkgs (import nixpkgs { inherit system; })
    );
  in
  {
    devShells = toSystems (pkgs: {
      default = pkgs.mkShell {
        name = "Quackers Bird Club";

        packages = with pkgs; [
          hugo
          dart-sass
          nodejs
        ];
      };
    });
  };
}
