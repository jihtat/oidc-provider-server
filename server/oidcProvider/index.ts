import { ClientMetadata, KoaContextWithOIDC, Provider } from "oidc-provider";

const clients: ClientMetadata[] = [
  {
    client_id: "test_app",
    grant_types: ["authorization_code"],
    client_secret: "abc",
    response_types: ["code"],
    redirect_uris: ["https://oidcdebugger.com/debug"],
  },
];

export const oidcProvider = new Provider("http://localhost:5000/provider", {
  clients: clients,
  pkce: {
    methods: ["S256"],
    required: () => {
      return false;
    },
  },
  interactions: {
    url(ctx: KoaContextWithOIDC, interaction: any) {
      return `provider/interaction/${interaction.uid}`;
    },
  },
});
