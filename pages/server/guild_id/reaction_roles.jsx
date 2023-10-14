/* eslint-disable indent */
import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import strings from "@script/locale";
import axios from "axios";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import Alert from "@component/alert";
import debounce from "lodash/debounce";
import SkeletonLoading from "@component/ReactionRoles/SkeletonLoading";
import ReactionRolesRow from "@component/ReactionRoles/Row";
import { sortableContainer, sortableElement } from "@component/react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

export const SortableItem = sortableElement(({ value, dir }) => (
  <li className="list-style-none" dir={dir}>
    {value}
  </li>
));

export const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

export default function ReactionRole() {
  const { guild, rtl, setGuild } = useContext(Context);
  const [data, setData] = useState(guild?.reaction_roles || []);
  const [state, setStates] = useState({
    embeds: [],
    loading: true,
    error: false,
  });
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));
  const [NoEmbedAlert, setNoEmbedAlert] = useState(true);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let mounted = true;

    axios.get(`/guilds/${guild.id}/embeds`).then(({ data: embeds }) => {
      if (!mounted) return;
      if (embeds.length === 0) return setState({ error: true, loading: false });

      setState({
        embeds: embeds.map((embed) => ({ ...embed, messages: embed.sent })),
        loading: false,
      });
    });

    return () => (mounted = false);
  }, []);

  const addCard = () => {
    setData([
      ...data,
      {
        reactions: [],
        roles_limit: 0,
        type: "toggle",
        embed: "",
        message_id: "",
        channel_id: null,
        sent: {},
        notification: {
          enabled: false,
          give_message: "✅ Added **{0}**",
          take_message: "❌ Removed **{0}**",
          no_changes_messages: "❌ There have been no changes in roles."
        }
      },
    ]);
  };

  const save = useCallback(
    debounce((data) => {
      axios.put(`/guilds/${guild.id}/reaction_roles`, data);
    }, 800),
    []
  );

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGuild({
      id: guild.id,
      reaction_roles: arrayMoveImmutable(
        guild.reaction_roles,
        oldIndex,
        newIndex
      ),
    });
    setData(arrayMoveImmutable(data, oldIndex, newIndex));
    save(arrayMoveImmutable(guild.reaction_roles, oldIndex, newIndex));
  };

  if (!data) return <div />;

  return (
    <div className="component-container">
      <PagesTitle
        data={{
          name: "reaction_roles",
          description: "rr description",
          module: "reaction_roles",
        }}
      />
      <Unsaved
        method="reaction_roles"
        type="array"
        state={data}
        setStates={setData}
        validate={() => {
          let error = true;

          data.forEach((card) => {
            if (!card.embed) return (error = strings.rr_select_embed);
            if (!card.message_id) return (error = strings.rr_select_message);

            card.reactions.filter((reaction) => {
              if ((reaction.type || 0) === card.action_type) {
                if (card.action_type === 3) {
                  reaction.options.some(
                    (option) => option.label === "" || option.value === ""
                  )
                    ? (error = strings.rr_error_options)
                    : (error = true);
                } else if (card.action_type === 2) {
                  card.reactions
                    .filter((reaction) => reaction.type === 2)
                    .some(
                      (option) =>
                        option.label === "" || option.roles.length === 0
                    )
                    ? (error =
                        "Make sure you have selected roles for all buttons and that they have a label")
                    : (error = true);
                } else if (card.action_type === 0) {
                  card.reactions
                    .filter((reaction) => reaction.type === 2)
                    .some((option) => option.roles.length === 0)
                    ? (error = strings.rr_error_reaction_emoji)
                    : (error = true);
                }
              }
            });
          });

          return error;
        }}
      />

      <div className="reaction_role">
        <div className="rr-add-message-btn">
          {state.error ? (
            <Alert
              open={NoEmbedAlert}
              type="warning"
              handelClose={() => setNoEmbedAlert(false)}
              className="mb-15"
            >
              <span>
                {strings.rr_requires_embed_1}{" "}
                <Link href={`/server/${guild.id}/embed`} legacyBehavior>
                  <a
                    href="#"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    {strings.rr_requires_embed_2}
                  </a>
                </Link>
              </span>
            </Alert>
          ) : (
            <button className="btn btn-secondary mt-10" onClick={addCard}>
              {strings.add_message}
            </button>
          )}
        </div>
        <SortableContainer
          updateBeforeSortStart={() => setOpen(false)}
          onSortEnd={onSortEnd}
          useDragHandle
        >
          {data &&
            Array.isArray(data) &&
            data.map((card, index) => (
              <SortableItem
                key={`item-${index}`}
                index={index}
                dir={rtl ? "rtl" : "ltr"}
                value={
                  <ReactionRolesRow
                    data={data}
                    setData={setData}
                    embeds={state.embeds}
                    key={index}
                    index={index}
                    card={card}
                    open={open}
                    setOpen={setOpen}
                  />
                }
              />
            ))}
        </SortableContainer>
      </div>
    </div>
  );
}
